import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";

interface Job {
  jobTitle: string;
  link: string;
  companyName: string;
  location: string;
  summary: string;
  date: string;
}

const App: React.FC = () => {
  const [jobs, setJobs] = useState<Array<Job>>([]);
  const [jobTitle, setJobTitle] = useState<string>("");

  useEffect((): void => {
    (async (): Promise<void> => {
      const res = await axios.get("/api/jobs?jobTitle=" + jobTitle);
      setJobs((prev) => res.data);
    })();
  }, []);

  return (
    <div>
      {jobs.length === 0 && <h2>Loading Jobs, please wait...</h2>}
      {jobs.length > 0 &&
        jobs.map((job) => {
          if (job.jobTitle) {
            return (
              <Fragment key={job.link}>
                <h3>
                  <a href={job.link}>{job.jobTitle}</a>
                </h3>
                <div>{job.companyName}</div>
                <div>{job.location}</div>
                <div>{job.summary}</div>
                <div>{job.date}</div>
                <a href={job.link}>Click here to check out this position!</a>
              </Fragment>
            );
          }
          return false;
        })}
    </div>
  );
};

export default App;
