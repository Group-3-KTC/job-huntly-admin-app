import JobListStatic from "../components/JobListStatic"
import JobListTable from "../components/JobListTable"


const JobListPage = () => {
  return (
    <div className="w-full px-6">
      <JobListStatic />
      <JobListTable />
    </div>
  )
}

export default JobListPage