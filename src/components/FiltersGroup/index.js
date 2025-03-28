import './index.css'

const FiltersGroup = props => {
  const {
    employmentTypesList,
    salaryRangesList,
    locationsList,
    changeSalary,
    changeEmployeeList,
    changeLocationFilter,
  } = props

  return (
    <div className="filters-group-container">
      <h1>Type of Employment</h1>
      {employmentTypesList.map(({label, employmentTypeId}) => (
        <div key={employmentTypeId}>
          <input
            type="checkbox"
            id={employmentTypeId}
            onChange={() => changeEmployeeList(employmentTypeId)}
          />
          <label htmlFor={employmentTypeId}>{label}</label>
        </div>
      ))}

      <h1>Salary Range</h1>
      {salaryRangesList.map(({label, salaryRangeId}) => (
        <div key={salaryRangeId}>
          <input
            type="radio"
            name="salary"
            id={salaryRangeId}
            onChange={() => changeSalary(salaryRangeId)}
          />
          <label htmlFor={salaryRangeId}>{label}</label>
        </div>
      ))}

      <h1>Location</h1>
      {locationsList.map(location => (
        <div key={location}>
          <input
            type="checkbox"
            id={location}
            onChange={() => changeLocationFilter(location)}
          />
          <label htmlFor={location}>{location}</label>
        </div>
      ))}
    </div>
  )
}

export default FiltersGroup
