import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import FiltersGroup from '../FiltersGroup'
import JobCard from '../JobCard'

import './index.css'

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

const locationsList = ['Hyderabad', 'Bangalore', 'Chennai', 'Delhi', 'Mumbai']

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    apiStatus: apiStatusConstants.initial,
    employeeType: [],
    minimumSalary: 0,
    searchInput: '',
    selectedLocations: [],
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {employeeType, minimumSalary, searchInput, selectedLocations} =
      this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employeeType.join()}&minimum_package=${minimumSalary}&search=${searchInput}&location=${selectedLocations.join()}`
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedJobsData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobsList: updatedJobsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  changeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobs()
    }
  }

  changeSalary = salary => {
    this.setState({minimumSalary: salary}, this.getJobs)
  }

  changeEmployeeList = type => {
    this.setState(
      prevState => ({
        employeeType: prevState.employeeType.includes(type)
          ? prevState.employeeType.filter(item => item !== type)
          : [...prevState.employeeType, type],
      }),
      this.getJobs,
    )
  }

  changeLocationFilter = location => {
    this.setState(
      prevState => ({
        selectedLocations: prevState.selectedLocations.includes(location)
          ? prevState.selectedLocations.filter(item => item !== location)
          : [...prevState.selectedLocations, location],
      }),
      this.getJobs,
    )
  }

  renderLoadingView = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderAllJobs = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsList()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderJobsList = () => {
    const {jobsList} = this.state
    return jobsList.length > 0 ? (
      <ul className="jobs-list">
        {jobsList.map(job => (
          <JobCard jobData={job} key={job.id} />
        ))}
      </ul>
    ) : (
      <div className="no-jobs-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters.</p>
      </div>
    )
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <FiltersGroup
            employmentTypesList={employmentTypesList}
            salaryRangesList={salaryRangesList}
            locationsList={locationsList}
            changeSearchInput={this.changeSearchInput}
            searchInput={searchInput}
            getJobs={this.getJobs}
            changeSalary={this.changeSalary}
            changeEmployeeList={this.changeEmployeeList}
            changeLocationFilter={this.changeLocationFilter}
          />
          <div className="search-input-jobs-list-container">
            <div className="search-input-container-desktop">
              <input
                type="search"
                placeholder="Search"
                onChange={this.changeSearchInput}
                onKeyDown={this.onEnterSearchInput}
              />
              <button onClick={this.getJobs}>
                <BsSearch />
              </button>
            </div>
            {this.renderAllJobs()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
