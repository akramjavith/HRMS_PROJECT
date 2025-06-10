
import { getCurrentServerTime } from '../../../components/getCurrentServerTime';



const [serverTime, setServerTime] = useState(null);
  useEffect(() => {
    const fetchTime = async () => {
      const time = await getCurrentServerTime();
      setServerTime(time);
    };

    fetchTime();
  }, []);


   useEffect(() => {
    getCurrentServerTime();

    const interval = setInterval(() => {
      setServerTime((prevTime) => moment(prevTime).add(1, 'second'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  import moment from 'moment-timezone';
   fromdate: moment(time).format("YYYY-MM-DD"),
        todate: moment(time).format("YYYY-MM-DD"),

  new Date(serverTime)
