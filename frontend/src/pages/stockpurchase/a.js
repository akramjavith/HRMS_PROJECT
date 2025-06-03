
import { getCurrentServerTime } from '../../../components/getCurrentServerTime';



const [serverTime, setServerTime] = useState(null);
  useEffect(() => {
    const fetchTime = async () => {
      const time = await getCurrentServerTime();
      setServerTime(time);
    };

    fetchTime();
  }, []);


  new Date(serverTime)
