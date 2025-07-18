import JobListStatic from "../components/JobListStatic"
import JobListTable from "../components/JobListTable"


const JobListPage = () => {
  return (
    <div className="w-full px-2 md:px-6">
      <JobListStatic />
      <JobListTable />
    </div>
  )
}

export default JobListPage