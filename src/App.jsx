import React, { useState, useEffect } from 'react';
import { DateRangePicker } from 'react-date-range';
import { format, intervalToDuration } from 'date-fns';
import 'react-date-range/dist/styles.css'; // default style
import 'react-date-range/dist/theme/default.css'; // theme css file

function App() {
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const [jobTitle, setJobTitle] = useState('');
  const [jobs, setJobs] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);

  // Load jobs from local storage when component mounts
  useEffect(() => {
    const storedJobs = localStorage.getItem('jobs');
    if (storedJobs) {
      setJobs(JSON.parse(storedJobs));
    }
  }, []);

  // Save jobs to local storage when jobs state changes
  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { startDate, endDate } = dateRange[0];
    const updatedJobs = [...jobs];
    if (editIndex >= 0) {
      updatedJobs[editIndex] = { title: jobTitle, startDate, endDate };
      setEditIndex(-1);
    } else {
      updatedJobs.push({ title: jobTitle, startDate, endDate });
    }
    setJobs(updatedJobs);
    setJobTitle('');
    setDateRange([
      { startDate: new Date(), endDate: new Date(), key: 'selection' },
    ]);
  };

  const handleDelete = (index) => {
    const updatedJobs = [...jobs];
    updatedJobs.splice(index, 1);
    setJobs(updatedJobs);
  };

  const handleEdit = (index) => {
    setJobTitle(jobs[index].title);
    setDateRange([
      {
        ...dateRange[0],
        startDate: jobs[index].startDate,
        endDate: jobs[index].endDate,
      },
    ]);
    setEditIndex(index);
  };

  const renderDuration = (startDate, endDate) => {
    const duration = intervalToDuration({
      start: new Date(startDate),
      end: new Date(endDate),
    });
    return `${duration.years || 0} years, ${duration.months || 0} months, ${
      duration.days || 0
    } days`;
  };
  return (
    <div className="container mx-auto px-4 py-2">
      <div className="flex justify-center align-center">
        <h2 className="text-3xl font-bold m-4 pb-4 mb-4">
          Job Timeline Tracker
        </h2>
      </div>

      <div className="flex justify-center align-center">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Job Title"
            className="form-input px-4 py-2 border rounded"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <DateRangePicker
            onChange={(item) => setDateRange([item.selection])}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={2}
            ranges={dateRange}
            direction="horizontal"
            className="my-4"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {editIndex >= 0 ? 'Update Job' : 'Add Job'}
          </button>
        </form>
      </div>

      <div className="flex justify-center align-center">
        <div className="mt-6">
          <h3 className="text-2xl font-bold mb-2">Jobs List</h3>
          <ul>
            {jobs.map((job, index) => (
              <li
                key={index}
                className="bg-gray-100 rounded p-4 flex justify-between items-center mb-2"
              >
                <span>
                  {job.title}:{' '}
                  {format(new Date(job.startDate), 'MMMM do, yyyy')} -{' '}
                  {format(new Date(job.endDate), 'MMMM do, yyyy')} (
                  {renderDuration(job.startDate, job.endDate)})
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
