// @flow
import React from "react"

import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"

import TopBar from "../components/topBar"
import UserIcon from "../components/userIcon"

import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  Switch
} from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper"
import Button from "@material-ui/core/Button"
import Container from "@material-ui/core/Container"
import { makeStyles } from "@material-ui/styles"

import UserStorage from "../shared/storage/userStorage"

const useStyles = makeStyles({
  section: {
    marginTop: 10,
    marginBottom: 10
  },
  margined: {
    padding: 20
  }
})

const Plan = () => {
  const [showPaymentDialog, setShowPaymentDialog] = React.useState(false)
  const classes = useStyles()
  const stripe = useStripe()
  const elements = useElements()
  //const user = new UserStorage().loadUser()

  const onShowPaymentDialog = () => {
    setShowPaymentDialog(true)
  }

  const onClosePaymentDialog = () => {
    setShowPaymentDialog(false)
  }

  const onSubmitPaymentDialog = () => {
    const cardElement = elements.getElement(CardElement)
    stripe.createToken(cardElement).then(result => {
      console.log("result = ", result)
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
            Payments are handled by{" "}
            <a target="_blank" href="https://stripe.com">
              Stripe
            </a>
            .
          </p>
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

  return (
    <React.Fragment>
      <TopBar>
        <UserIcon />
      </TopBar>

      <Container maxWidth="lg">
        <Paper elevation={2} className={classes.section}>
          <div className={classes.margined}>
            <Typography variant="h4">Your Profile</Typography>
            <Typography variant="body1">
              Ultralist includes a 30-day free trial.
            </Typography>
          </div>
        </Paper>

        <Paper elevation={2} className={classes.section}>
          <div className={classes.margined}>
            <Typography variant="h4">Integrations</Typography>
            <List>
              <ListItem>
                <Switch /> Zapier
              </ListItem>
            </List>
            <Typography variant="body1">Ultralist int</Typography>
          </div>
        </Paper>

        <Paper elevation={2} className={classes.section}>
          <div className={classes.margined}>
            <Typography variant="h4">Your plan</Typography>
            <Typography variant="body1">
              Ultralist includes a 30-day free trial, and is $3/month. Cancel
              anytime.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={onShowPaymentDialog}
            >
              Add credit card info
            </Button>

            <PaymentDialog />
          </div>
        </Paper>
      </Container>
    </React.Fragment>
  )
}

export default Plan
