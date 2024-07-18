import React, {useState, useEffect} from "react";
import axios from 'axios';
import styled from "styled-components";

const Container = styled.div`
    text-align: center;
  font-family: Arial, sans-serif, Helvetica;
  background-image: image('../public/image/images3.jpeg');
`

const Form = styled.form`
    margin-bottom: 20px;
`

const Input = styled.input`
    padding: 8px;
  margin-right: 10px;
`

const Button = styled.button`
    padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
`

const WeatherDataContainer = styled.div`
    background-color: #f2f2f2;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`

const Error = styled.p`
    color: red;
`

export const App = () => {
    const [location, setLocation] = useState('');
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [unit, setUnit] = useState('metric');


    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const {latitude, longitude} = position.coords;
                    fetchDataByCoords(latitude, longitude);
                },
                (error) => {
                    setError('Не удалось получить ваше местоположениею')
                }
            );
        } else {
            setError('Геолокация не поддерживается вашим браузером.')
        }
    }, [])


    const fetchDataByCoords = (latitude, longitude) => {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=f03bc583c9cab0b94cb11dc8b6fce81c`)
            .then((response) => {
                setData(response.data)
            })
            .catch((error) => {
                setError('Не удалось получить данные о погоде.')
            });
    };


    const fetchDataByLocation = () => {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${unit}&appid=f03bc583c9cab0b94cb11dc8b6fce81c`)
            .then((response) => {
                setData(response.data)
            })
            .catch((error) => {
                setError('Не удалось получить данные о погоде.')
            })
    }


    const handleLocationChange = (e) => {
        setLocation(e.target.value)
    }

    const handleFormSubmit = (e) => {
        e.preventDefault()
        fetchDataByLocation()
    }

    const handUnitChange = (e) => {
        setUnit(e.target.value)
        if (data) {
            if (location === '') {
                fetchDataByCoords(data.coord.lat, data.coord.lon)
            } else {
                fetchDataByLocation()
            }
        }
    }

    return (
        <Container>
            <h1> Weather app</h1>
            <Form onSubmit={handleFormSubmit}>
                <Input type='text' value={location} onChange={handleLocationChange} plaseholder='Введите место' />
                <Button type='submit'>Узнать погоду</Button>
            </Form>
            <label>
                Выберите единицы измерения:
                <select value={unit} onChange={handUnitChange}>
                    <option value="metric">Celsius</option>
                    <option value="imperial">Fahrenheit</option>
                </select>
            </label>
            {error && <Error>{error}</Error>}
            {data && (<WeatherData data={data} unit={unit}/>)}
        </Container>
    )
}


const WeatherData = ({data, unit}) => {
    return(
        <dataContainer>
            <h2>Погода в {data.name}</h2>
            <p>Температура: {data.main.temp}˚{unit === 'metric' ? 'C': 'F' } </p>
            <p>Влажность: {data.main.humidity}%</p>
            <p>Скорость ветра: {data.wind.speed} м/с</p>
        </dataContainer>
    )
}

export default App;
