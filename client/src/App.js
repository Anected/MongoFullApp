import React, {Component} from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
    state = {
        name: null,
        age: null,
        intervalIsSet: false
    };

    componentDidMount() {
        if (!this.state.intervalIsSet) {
            let interval = setInterval(this.getDataFromDb, 1000);
            this.setState({intervalIsSet: interval});
        }
    }

    getDataFromDb = () => {
        return axios.get('http://localhost:3001/api/users')
            .then(res => {
                this.setState({users: res.data})
            })
    };

    putDataToDB = (userName, userAge) => {
        axios.post("http://localhost:3001/api/users", {
            name: userName,
            age: userAge
        });
    };


    render() {
        const {users} = this.state;
        console.log(users);
        return (
            <div className="App">
                <table className={"table_user"}>
                    <caption>Users</caption>
                    <tr className={'tr_user'}>
                        <th className={'th_user'}>id</th>
                        <th className={'th_user'}>name</th>
                        <th className={'th_user'}>age</th>
                    </tr>
                    {users.map((user, key) => {
                        const {_id, name, age} = user;
                        return (
                            <tr key={key} className="tr_user">
                                <td className={"td_user"}>{_id}</td>
                                <td className={"td_user"}>{name}</td>
                                <td className={"td_user"}>{age}</td>
                            </tr>
                        )
                    })}
                </table>
                <div style={{padding: "10px"}}>
                    <input
                        type="text"
                        onChange={e => this.setState({name: e.target.value})}
                        placeholder="add name"
                        style={{width: "200px"}}
                    />
                    <input
                        type="text"
                        onChange={e => this.setState({age: e.target.value})}
                        placeholder="add age"
                        style={{width: "200px"}}
                    />
                    <button onClick={() => this.putDataToDB(this.state.name, this.state.age)}>
                        ADD
                    </button>
                </div>
            </div>
        );


    }
}


export default App;
