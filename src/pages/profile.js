// @flow
import React from "react"
import { Redirect } from "react-router-dom"

import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"
import { withSnackbar } from "notistack"

import TopBar from "../components/topBar"
import UserIcon from "../components/userIcon"
import ApiKeys from "../components/profile/apiKeys"
import Users from "../components/profile/users"

import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent
} from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper"
import Button from "@material-ui/core/Button"
import Container from "@material-ui/core/Container"
import { TextField } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"

import StorageContext from "../shared/storageContext"
import BackendContext from "../shared/backendContext"
import UserStorage from "../shared/storage/userStorage"

import AccountBackend from "../shared/backend/accountBackend"

const useStyles = makeStyles({
  section: {
    marginTop: 15,
    marginBottom: 15
  },
  margined: {
    padding: 20
  }
})

const StripePlan =
  process.env.NODE_ENV === "production"
    ? "plan_HIRnWv1qQXJQw6"
    : "plan_HGSBu1gixZg45K"

const Plan = (props: Props) => {
  const [showPaymentDialog, setShowPaymentDialog] = React.useState(false)
  const [errors, setErrors] = React.useState([])
  const classes = useStyles()

  const stripe = useStripe()
  const elements = useElements()

  const userStorage = new UserStorage(React.useContext(StorageContext))
  const user = userStorage.loadUser()

  const accountBackend = new AccountBackend(
    user ? user.token : "",
    React.useContext(BackendContext)
  )

  const fullNameRef = React.useRef(null)

  if (!user) {
    return <Redirect to="/login" />
  }

  const onShowPaymentDialog = () => {
    setShowPaymentDialog(true)
  }

  const onClosePaymentDialog = () => {
    setShowPaymentDialog(false)
  }

  const onSubmitPaymentDialog = async () => {
    const cardElement = elements.getElement(CardElement)
    const result = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: { email: user.email, name: fullNameRef.current.value }
    })

    if (result.error) {
      setErrors([result.error.message])
      return
    }

    const resp = await accountBackend.updateAccount(
      user.account,
      StripePlan,
      result.paymentMethod.id
    )

    const errors = JSON.parse(resp.errors)

    if (errors.length > 0) {
      setErrors(errors)
    } else {
      userStorage.loginUser(resp)
      props.enqueueSnackbar(
        "Thank you for supporting Ultralist - a single-person, bootstrapped side project!"
      )
      onClosePaymentDialog()
    }
  }

  const showErrors = () => {
    if (errors.length === 0) return

    return errors.map(error => {
      return <Typography variant="h5">{error}</Typography>
    })
  }

  const PaymentDialog = () => {
    return (
      <Dialog
        open={showPaymentDialog}
        onClose={onClosePaymentDialog}
        fullWidth={true}
      >
        <DialogTitle>Add card info</DialogTitle>
        <DialogContent>
          <p>
            Payments are handled by
            <a target="_blank" href="https://stripe.com">
              Stripe
            </a>
            .
          </p>

          {showErrors()}

          <TextField
            label="Full name"
            defaultValue={user.name}
            ref={fullNameRef}
          />

          <CardElement options={{ style: { base: { fontSize: "18px" } } }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClosePaymentDialog}>Cancel</Button>
          <Button onClick={onSubmitPaymentDialog} disabled={!stripe}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  const TrialingText = () => (
    <React.Fragment>
      <Typography variant="body1">
        Ultralist includes a 14-day free trial, and is $5/month. Cancel anytime.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={onShowPaymentDialog}
        className={classes.section}
      >
        Add a credit card
      </Button>
    </React.Fragment>
  )
  const PaidText = () => (
    <React.Fragment>
      <Typography variant="body1">
        Your account is in good standing. Thank you for being an Ultralist
        customer!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={onShowPaymentDialog}
        className={classes.section}
      >
        Update payment method
      </Button>
    </React.Fragment>
  )

  const UnpaidText = () => (
    <React.Fragment>
      <Typography variant="body1">
        You need to update your card info in order to continue to use Ultralist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={onShowPaymentDialog}
        className={classes.section}
      >
        Update payment method
      </Button>
    </React.Fragment>
  )

  const CancelledText = () => (
    <React.Fragment>
      <Typography variant="body1" style={{ color: "red" }}>
        Your free trial is over. Please add a payment method to continue to use
        Ultralist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={onShowPaymentDialog}
        className={classes.section}
      >
        Add a credit card
      </Button>
    </React.Fragment>
  )

  const ProfileSection = () => {
    return (
      <Paper elevation={2} className={classes.section}>
        <div className={classes.margined}>
          <Typography variant="h4">Your Profile</Typography>
        </div>
      </Paper>
    )
  }

  const PlanSection = () => {
    return (
      <Paper elevation={2} className={classes.section}>
        <div className={classes.margined}>
          <Typography variant="h4">Your plan</Typography>

          {user.account.status === "trialing" && <TrialingText />}
          {user.account.status === "paid" && <PaidText />}
          {user.account.status === "unpaid" && <UnpaidText />}
          {user.account.status === "cancelled" && <CancelledText />}

          <PaymentDialog />
        </div>
      </Paper>
    )
  }

  return (
    <React.Fragment>
      <TopBar>
        <UserIcon />
      </TopBar>

      <Container maxWidth="lg">
        <ProfileSection />

        <Users />

        <ApiKeys />

        <PlanSection />
      </Container>
    </React.Fragment>
  )
}

export default withSnackbar(Plan)
