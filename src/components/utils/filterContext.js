import React from "react"

import FilterModel from "../../shared/models/filter"

const FilterContext = React.createContext({
  filter: {},
  setFilter: (f: FilterModel) => {}
})

export default FilterContext
