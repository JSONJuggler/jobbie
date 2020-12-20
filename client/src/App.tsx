import React, { useState, Fragment, ChangeEvent, FormEvent } from "react";
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
  const [init, setInit] = useState<boolean>(true);
  const [searching, setSearching] = useState<boolean>(false);
  const [jobs, setJobs] = useState<Array<Job>>([]);
  const [jobTitle, setJobTitle] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setJobs((prev) => []);

    if (init) {
      setInit((prev) => false);
    }

    setSearching((prev) => true);
    const res = await axios.get("/jobbie/api/jobs?jobTitle=" + jobTitle);
    setSearching((prev) => false);
    setJobs((prev) => res.data);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const userInput: string = e.target.value;
    setJobTitle((prev) => userInput);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Enter job search here:
          <input
            type="text"
            id="search"
            name="search"
            value={jobTitle}
            onChange={handleChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
      {init && <h2>Find your dream job!</h2>}
      {!init && searching && jobs.length === 0 && (
        <h2>Loading Jobs, please wait...</h2>
      )}
      {!init && !searching && jobs.length === 0 && (
        <h2>No jobs found. Please try a different search.</h2>
      )}
      {!init &&
        jobs.length > 0 &&
        jobs.map((job) => {
          if (job?.jobTitle) {
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
