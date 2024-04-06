import React, { useState } from 'react';
import './App.css';

const students = [
  { id: 1, name: 'John', ticketNumber: 'A001', ticketTopic: 'Math', examGrade: 4.5, ratingGrade: 3.8, comments: '' },
  { id: 2, name: 'Alice', ticketNumber: 'A002', ticketTopic: 'Science', examGrade: 3.8, ratingGrade: 4.2, comments: '' },
  { id: 3, name: 'Emily', ticketNumber: 'A003', ticketTopic: 'Literature', examGrade: 4.2, ratingGrade: 4.0, comments: '' },
  { id: 4, name: 'Michael', ticketNumber: 'A004', ticketTopic: 'History', examGrade: 4.0, ratingGrade: 3.9, comments: '' },
  { id: 5, name: 'Sophia', ticketNumber: 'A005', ticketTopic: 'Biology', examGrade: 4.7, ratingGrade: 4.5, comments: '' },

];

const App = () => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [showStatistics, setShowStatistics] = useState(false);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);

  const calculateFinalGrade = (examGrade, ratingGrade) => {
    return 0.6 * examGrade + 0.4 * ratingGrade;
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortBy(`-${field}`);
    } else {
      setSortBy(field);
    }
  };

  const filteredStudents = students.filter(student => {
    if (filter === 'all') {
      return true;
    } else if (filter === 'passed') {
      return calculateFinalGrade(student.examGrade, student.ratingGrade) >= 4;
    } else if (filter === 'failed') {
      return calculateFinalGrade(student.examGrade, student.ratingGrade) < 4;
    }
  }).filter(student => {
    return student.name.toLowerCase().includes(searchTerm.toLowerCase());
  }).sort((a, b) => {
    if (sortBy) {
      return sortBy.startsWith('-') ?
        b[sortBy.slice(1)] - a[sortBy.slice(1)] :
        a[sortBy] - b[sortBy];
    }
    return 0;
  });
  const calculateStatistics = () => {
    const finalGrades = filteredStudents.map(student => calculateFinalGrade(student.examGrade, student.ratingGrade));
    const totalStudents = filteredStudents.length;
    const passedStudents = filteredStudents.filter(student => calculateFinalGrade(student.examGrade, student.ratingGrade) >= 4).length;
    const failedStudents = totalStudents - passedStudents;
    const averageGrade = finalGrades.reduce((acc, curr) => acc + curr, 0) / totalStudents;
    const maxGrade = Math.max(...finalGrades);
    const minGrade = Math.min(...finalGrades);

    return {
      totalStudents,
      passedStudents,
      failedStudents,
      averageGrade: averageGrade.toFixed(2),
      maxGrade,
      minGrade
    };
  };
  const showDetails = (student) => {
    setSelectedStudentDetails(student);
  };

  return (
    <div className="app">
      <header>
        <h1>Gradebook</h1>
       
      </header>
      <main>
        <div className="options">
          <select onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
          </select>
          <input type="text" placeholder="Search by name" onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>Name</th>
              <th onClick={() => handleSort('ticketNumber')}>Ticket Number</th>
              <th onClick={() => handleSort('ratingGrade')}>Rating Grade</th>
              <th onClick={() => handleSort('examGrade')}>Exam Grade</th>
              <th onClick={() => handleSort('finalGrade')}>Final Grade</th>
              <th>Status</th>
             
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id} className={selectedRow === student.id ? 'selected' : ''} onClick={() => setSelectedRow(student.id)}>
                <td>{selectedRow === student.id ? student.name.toUpperCase() : student.name}</td>
                <td>{student.ticketNumber}</td>
                <td>{student.ratingGrade}</td>
                <td>{student.examGrade}</td>
                <td>{calculateFinalGrade(student.examGrade, student.ratingGrade)}</td>
                <td>{calculateFinalGrade(student.examGrade, student.ratingGrade) >= 4 ? 'Passed' : 'Failed'}</td>
                
                <td>
                  <button onClick={() => showDetails(student)}>Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => setShowStatistics(!showStatistics)}>{showStatistics ? 'Hide Statistics' : 'Show Statistics'}</button>
        {showStatistics && (
          <div className="statistics">
            <h2>Statistics</h2>
            <p>Total Students: {calculateStatistics().totalStudents}</p>
            <p>Passed Students: {calculateStatistics().passedStudents}</p>
            <p>Failed Students: {calculateStatistics().failedStudents}</p>
            <p>Average Grade: {calculateStatistics().averageGrade}</p>
            <p>Max Grade: {calculateStatistics().maxGrade}</p>
            <p>Min Grade: {calculateStatistics().minGrade}</p>
          </div>
        )}
      </main>
      
      {selectedStudentDetails && (
        <div className="details">
          <h2>Details</h2>
          <p>Name: {selectedStudentDetails.name}</p>
          <p>Ticket Number: {selectedStudentDetails.ticketNumber}</p>
          <p>Ticket Topic: {selectedStudentDetails.ticketTopic}</p>
          <footer>
        <p>Signature:Satya Lakshmi</p>
        <p>Date: {new Date().toLocaleDateString()}</p>
      </footer>
        </div>
        
      )}
    </div>
  );
};

export default App;
