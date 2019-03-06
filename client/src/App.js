import React, {Component} from 'react';
import axios from 'axios';
import './App.css';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

class App extends Component {
    state = {
        name: null,
        age: null,
        users: [],
        userDel: {
            name: null,
            age:null,
            id: null
        },
        totalPages: null,
        activePage: 1,
        activePageUsers: [],
        elementsOnPage: 5,
        showModalDelete: false,
        showModalAdd: false

    };

    componentDidMount() {
        this.getDataFromDb();
    }

    getDataFromDb = () => {
        return axios.get('http://localhost:3001/api/users')
            .then(res => {
                this.setState({users: res.data});
                this.setState(() => {
                        const allpages = this.state.users.length;
                        const pages = Math.ceil(allpages / this.state.elementsOnPage);
                        return {
                            totalPages: pages
                        }
                    }
                );
                this.setState(() => {
                    const indexActiveData = this.state.activePage * this.state.elementsOnPage;
                    const previosActiveData = (this.state.activePage - 1) * this.state.elementsOnPage;
                    if (this.state.activePage > 1 && this.state.activePage <= this.state.totalPages) {
                        return {activePageUsers: this.state.users.slice(previosActiveData, indexActiveData)}

                    }
                    else if (this.state.activePage === 1) {
                        return {
                            activePageUsers: this.state.users.slice(0, this.state.elementsOnPage)
                        }
                    }
                });
            })
    };

    putDataToDB = (userName, userAge) => {
        if (userName && userAge) {
            axios.post("http://localhost:3001/api/users", {
                name: userName,
                age: userAge
            })
                .then(res => {
                    this.setState({name: null, age: null});
                    return this.getDataFromDb()
                })
        }
        else {
            alert('Не заполнены необходимые поля');
        }
    };
    deleteFromDB = idTodelete => {
        let objIdToDelete = null;
        this.state.users.forEach(dat => {
            if (dat._id === idTodelete) {
                objIdToDelete = dat._id;
            }
        });
        axios.delete("http://localhost:3001/api/users/" + objIdToDelete, {
            id: objIdToDelete
        })
            .then(res => {
                return this.getDataFromDb()
            })
    };

    handleClickNextPage = () => {
        if (this.state.activePage < this.state.totalPages) {
            this.setState(PreviosState => {
                return {
                    activePage: PreviosState.activePage + 1
                }
            });
            this.getDataFromDb();
        }
        else {
            return (alert('Вы достигли последней страницы'))
        }
    };

    handleClickPreviosPage = (event) => {
        if (this.state.activePage > 1) {
            this.setState(PreviosState => {
                return {
                    activePage: PreviosState.activePage - 1
                }
            });
            this.getDataFromDb();
        }
    };
    handleChangeElements = (event) => {
        const {value} = event.target;
        this.setState({elementsOnPage: value});
        this.getDataFromDb();
    };
    handleOpenModal = (event) => {
        const {name} = event.target;
        if (name === 'delete') {
            this.setState({showModalDelete: true});
        }
        else {
            this.setState({showModalAdd: true});
        }

    };

    handleCloseModal = (event) => {
        const {name} = event.target;
        if (name === 'delete') {
            this.setState({showModalDelete: false});
        }
        else {
            this.setState({showModalAdd: false});
        }

    };

    getTableData = (user) => {
    const {name,age,_id} = user;
    this.setState ({
        userDel:{
            name:name,
            age: age,
            id:_id
        }
    });
    };

    CloseDelete = () => {
        this.handleCloseModal();
        this.
    };




    render() {
        const {activePageUsers} = this.state;
        return (
            <div className="App">
                <table className="container">
                    <caption>Пользователи</caption>
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Имя</th>
                        <th>Возраст</th>
                    </tr>
                    </thead>
                    <tbody >
                    {activePageUsers.map((user, key) => {
                        const {_id, name, age} = user;
                        return (
                            <tr onClick={() => this.getTableData(user)} key={key}>
                                <td >{_id} </td>
                                <td >{name}</td>
                                <td >{age}</td>
                                <td>
                                    <div className="onbuton">
                                        <input name='delete' type="button" className='tbutton' value="Удалить"
                                               onClick={(e) => this.handleOpenModal(e)}/>
                                        <ReactModal
                                            className='modal'
                                            isOpen={this.state.showModalDelete}
                                            contentLabel=" Modal Example"
                                        >
                                            <label>
                                                <h2> Вы действительно хотите удалить следующего пользователя? </h2>
                                                <h3> id : {this.state.userDel.id} </h3>
                                                <h3> Имя : {this.state.userDel.name} </h3>
                                                <h3> Возраст : {this.state.userDel.age} </h3>
                                                <div className="onbuton">
                                                    <button name='delete' type="reset" className="button" value="Удалить"
                                                            onClick={
                                                                this.handleCloseModal && this.deleteFromDB(this.state.userDel.id)
                                                                //this.deleteFromDB(this.state.userDel.id)
                                                            }
                                                    >
                                                        Удалить
                                                    </button>
                                                    <button name='delete' type="reset" className='button'
                                                            onClick={this.handleCloseModal}>Отмена
                                                    </button>
                                                </div>
                                            </label>
                                        </ReactModal>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
                <div>
                    <h1> Страница {this.state.activePage} из {this.state.totalPages} </h1>

                    <div className='onbuton'>
                        <div><label className='pageselect'> Элементов на странице:
                            <select className='select' value={this.state.elementsOnPage}
                                    onChange={this.handleChangeElements}>
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                        </label>
                        </div>
                        <button className='button' name='previos' onClick={this.handleClickPreviosPage}> Предудущая
                            страница
                        </button>
                        <button className='button' name='next' onClick={this.handleClickNextPage}> Следующая страница
                        </button>
                    </div>
                </div>
                <div>
                    <div className="onbuton">
                        <button name='add' type="reset" className='button' onClick={this.handleOpenModal}>Добавить
                            пользователя
                        </button>
                        <ReactModal
                            name='add'
                            className='modal'
                            onRequestClose={this.handleCloseModal}
                            isOpen={this.state.showModalAdd}
                            contentLabel="Minimal Modal Example"
                        >
                            <div>
                                <input
                                    type="text"
                                    onChange={e => this.setState({name: e.target.value})}
                                    placeholder="Введите имя"
                                    className="input"
                                    value={this.state.name || ''}
                                />
                                <input
                                    type="text"
                                    onChange={e => this.setState({age: e.target.value})}
                                    placeholder="Введите возраст"
                                    className="input"
                                    value={this.state.age || ''}
                                />
                                <div className="onbuton">
                                    <button type="reset" className="button"
                                            onClick={() => this.putDataToDB(this.state.name, this.state.age)}>
                                        Добавить пользователя
                                    </button>
                                    <button type="reset" className='button' onClick={this.handleCloseModal}>Выйти
                                    </button>
                                </div>
                            </div>
                        </ReactModal>
                    </div>
                </div>
            </div>
        );


    }
}


export default App;
