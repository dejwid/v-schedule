import './App.css';
import {useEffect, useState} from "react";
import axios from "axios";
import parse from "./scheduleParser";

function App() {

  const [fileUrl, setFileUrl] = useState('https://api.npoint.io/40c600cdcd61dfc3b986');
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(fileUrl)
      .then(response => {
        setSchedule(parse(response.data));
        setError(null);
      })
      .catch(error => {
        setSchedule([]);
        setError(
          error.response
            ? error.response.status + ' ' + error.response.statusText
            : error.toString()
        );
      })
  }, [fileUrl]);

  return (
    <>
      <input type="text" value={fileUrl} onChange={e => setFileUrl(e.target.value)} />
      {!!error && (
        <div className="error">{error}</div>
      )}
      {!error && (
        <pre className="result">{schedule.map(row => (
          <div>{row}</div>
        ))}</pre>
      )}
    </>
  );
}

export default App;
