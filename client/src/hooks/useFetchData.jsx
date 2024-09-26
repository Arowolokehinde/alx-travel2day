import { useContext, useEffect, useState } from 'react'
import { authContext } from '../context/AuthContext';

const useFetchData = (url, key = null, requireToken = true) =>
{

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { token } = useContext(authContext);

    useEffect(() =>
    {
        const fetchData = async () =>
        {
            setLoading(true);

            try
            {
                let res;
                if (requireToken === false)
                {
                    res = await fetch(url)
                }
                else
                {
                    res = await fetch(url, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                }

                const result = await res.json();
                console.log(result)

                if (!res.ok)
                {
                    setError(result.message);
                    // console.log(result)
                    // throw new Error(result.message)
                }

                setData(result);
                setLoading(false);
            } catch (error)
            {
                setLoading(false);
                setError(error.message);
            }
        }
        fetchData();
    }, [url, key])

    return {
        data, loading, error
    }
}

export default useFetchData