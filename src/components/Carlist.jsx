import { useEffect, useState } from "react";
import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-material.css"; // Optional Theme applied to the grid
import Button from '@mui/material/Button';
import Addcar from './Addcar';
import Editcar from './Editcar'

function Carlist() {

    const [cars, setCars] = useState([]);


    const [colDefs] = useState([
        { field: "brand", filter: true, width: 150 },
        { field: "model", filter: true, width: 100 },
        { field: "color", filter: true, width: 100 },
        { field: "fuel", filter: true, width: 100 },
        { field: "modelYear", filter: true, width: 100 },
        { field: "price", filter: true, width: 100 },
        {
            width: 100,
            cellRenderer: params => <Editcar updateCar={updateCar} car={params.data} />
        },
        {
            cellRenderer: params =>
                <Button size="small" color="error" onClick={() => deleteCar(params.data._links.car.href)}>
                    Delete
                </Button>
        },


    ]);

    const deleteCar = (url) => {
        if (window.confirm("are you sure?")) {
            fetch(url, { method: 'DELETE' })
                .then(response => {
                    if (!response.ok)
                        throw new Error("Error in deletion: " + response.statusText);

                    return response.json();
                })
                .then(() => fetchCars())
                .catch(err => console.error(err))
        }
    };



    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = () => {

        fetch('https://carrestservice-carshop.rahtiapp.fi/cars')
            .then(response => {
                if (!response.ok)
                    throw new Error("Error in fetch: " + response.statusText);

                return response.json();
            })
            .then(data => setCars(data._embedded.cars))
            .catch(err => console.error(err))

    }

    const saveCar = (car) => {
        fetch('https://carrestservice-carshop.rahtiapp.fi/cars', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(car)
        })
            .then(() => fetchCars())
            .catch(err => console.error(err))
    }

    const updateCar = (car, link) => {
        fetch(link, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(car)
        })
            .then(() => fetchCars())
            .catch(err => console.error(err))

    }



    return (

        <div className="ag-theme-material" style={{ height: 600 }}>
            <Addcar saveCar={saveCar} />
            <AgGridReact
                rowData={cars}
                columnDefs={colDefs}
                pagination={true}
                paginationAutoPageSize={true}
            />
        </div>
    )

}

export default Carlist;