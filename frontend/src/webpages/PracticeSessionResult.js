import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useParams } from "react-router-dom";
import styled from 'styled-components';
import { handleApiError } from "../components/Errorhandling";
import { SERVICE } from "../services/Baseservice";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const Card = ({ employeeData }) => {
  const { employeename, result, overallresult } = employeeData;
  const navigate = useNavigate();
  return (
    <StyledWrapper>
      <div className="results-summary-container">
        {/* Celebration Confetti */}
        {/* {overallresult && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={200} // Increased confetti count
        />
        )} */}

        {/* Employee Name */}
        <div className="employee-name">
          <h2>{employeename || ""}</h2>
        </div>

        {/* Render Questions in Grid */}
        <div className="questions-container">
          {result?.length > 0 && result?.map((questionResult, index) => (
            <div key={index} className="question-card">
              <div className="question-text">
                <h3>Question {index + 1}</h3>
                <p>{questionResult.question}</p>
              </div>
              <div className="question-stats">
                <div className="stat">
                  <span>Accuracy:</span>
                  <span className={questionResult.accuracystatus ? 'passed' : 'failed'}>
                    {questionResult.accuracy}
                  </span>
                </div>
                <div className="stat">
                  <span>Speed:</span>
                  <span className={questionResult.speedstatus ? 'passed' : 'failed'}>
                    {questionResult.speed}
                  </span>
                </div>
                <div className="stat">
                  <span>Mistakes:</span>
                  <span className={questionResult.mistakesstatus ? 'passed' : 'failed'}>
                    {questionResult.mistakes}
                  </span>
                </div>
                <div className="stat">
                  <span>Time Taken:</span>
                  {questionResult.timetaken === "InComplete" ? <span className="failed">{questionResult.timetaken}</span> :

                    <span>{`${questionResult.timetaken?.split(":")[0]}Min:${questionResult.timetaken?.split(":")[1]}Sec`}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Back & Restart Buttons */}
        <Box display="flex" justifyContent="center" mt={3} gap={2}>
          <Button variant="contained" color="primary" onClick={() => {
            navigate("/interview/typingtestpracticesession");
          }} startIcon={<ArrowBackIosIcon />}>
            Back
          </Button>
          <Button variant="contained" color="secondary" onClick={() => {
            navigate(-1);
          }} startIcon={<RestartAltIcon />}>
            Restart
          </Button>
        </Box>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(to right, #2c3e50, #4ca1af); /* Gradient Background */

  .results-summary-container {
    font-family: "Hanken Grotesk", sans-serif;
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 1200px;
    padding: 30px;
    border-radius: 20px;
    box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.2);
    background-color: #ffffff;
    position: relative;
    overflow: hidden;
  }

  .employee-name {
    text-align: center;
    margin-bottom: 20px;
    h2 {
      font-size: 28px;
      color: #2c3e50;
      font-weight: bold;
    }
  }

  .questions-container {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
  }

  .question-card {
    flex: 1 1 calc(45% - 20px); /* 2 cards per row */
    max-width: 400px;
    padding: 15px;
    border-radius: 10px;
    background: linear-gradient(to bottom, #ecf0f1, #bdc3c7);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;
    
    &:hover {
      transform: scale(1.03);
    }
  }

  .question-text {
    margin-bottom: 10px;
    h3 {
      font-size: 18px;
      color: #34495e;
    }
    p {
      font-size: 14px;
      color: #666;
    }
  }

  .question-stats {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .stat {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      font-weight: bold;
      color: #333;
      
      .passed {
        color: green;
      }
      .failed {
        color: red;
      }
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .question-card {
      flex: 1 1 100%;
      max-width: 100%;
    }
  }
`;



const PracticeSessionResult = () => {
  const [employeeData, setEmployeeData] = useState([])
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const resultid = useParams()?.resultid;
  useEffect(() => {
    fetchResponse();
  }, [resultid])
  const fetchResponse = async () => {
    try {
      const [userResponse] =
        await Promise.all([
          axios.get(`${SERVICE.GET_TYPING_SESSION_RESPONSE}/${resultid}`),
        ]);
      setEmployeeData(userResponse?.data?.singlePracticeQuestionResponse)

    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (<><Card employeeData={employeeData} />



    <Confetti
      width={windowSize.width}
      height={windowSize.height}
      numberOfPieces={50 * employeeData?.result?.filter(data => data?.individualresult)?.length} // Increased confetti count
    />
    {/* ALERT DIALOG */}
    <Box>
      <Dialog
        open={isErrorOpen}
        onClose={handleCloseerr}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
        >
          {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
          <Typography variant="h6">{showAlert}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={handleCloseerr}
          >
            ok
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  </>);
};

export default PracticeSessionResult;
