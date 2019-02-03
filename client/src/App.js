import React, {Component} from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
    state = {
        name: null,
        age: null,
        users:[]
    };

    componentDidMount() {
        this.getDataFromDb();
    }

    getDataFromDb = () => {
        return axios.get('http://localhost:3001/api/users')
            .then(res => {
                this.setState({users: res.data})
            })
    };

    putDataToDB = (userName, userAge) => {
        if (userName != null && userAge != null){
            axios.post("http://localhost:3001/api/users", {
                name: userName,
                age: userAge
            })
                .then(res => {
                    return this.getDataFromDb()
                })
        }
    };

    render() {
        const {users} = this.state;
        return (
            <div className="App">
                <table className={"container"}>
                    <caption>Пользователи</caption>
                    <thead>
                    <tr >
                        <th>Id</th>
                        <th>Имя</th>
                        <th >Возраст</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user, key) => {
                        const {_id, name, age} = user;
                        return (
                            <tr onClick =key={key} >
                                <td >{_id}</td>
                                <td>{name}</td>
                                <td >{age}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
                <div>
                    <input
                        type="text"
                        onChange={e => this.setState({name: e.target.value})}
                        placeholder="Введите имя"
                        className="input"
                    />
                    <input
                        type="text"
                        onChange={e => this.setState({age: e.target.value})}
                        placeholder="Введите возраст"
                        className="input"

                    />
                    <button className="button" onClick={() => this.putDataToDB(this.state.name, this.state.age)}>
                        Добавить пользователя
                    </button>
                </div>
            </div>
        );


    }
}


export default App;
