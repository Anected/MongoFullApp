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
        userDelName: '',
        userDelAge: '',
        userDelId: '',
        sortedUsers: [],
        searchId: ' ',
        sorted: false,
        reverseSort: false,
        totalPages: null,
        activePage: 1,
        activePageUsers: [],
        elementsOnPage: 5,
        showModalDelete: false,
        showModalAdd: false,
        showModalUpdate: false

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
                        return this.pageUsers()
                    }
                )
            })
    };

    pageUsers = () => {
        this.setState((PreviosState) => {
            if (PreviosState.elementsOnPage !== this.state.elementsOnPage) {
                return {
                    activePage: 1
                }
            }
        });
        const indexActiveData = this.state.activePage * this.state.elementsOnPage;
        const previosActiveData = (this.state.activePage - 1) * this.state.elementsOnPage;
        if (this.state.sorted && this.state.activePage > 1 && this.state.activePage <= this.state.totalPages) {
            return {activePageUsers: this.state.sortedUsers.slice(previosActiveData, indexActiveData)}

        } else if (this.state.sorted && this.state.activePage === 1) {
            return {
                activePageUsers: this.state.sortedUsers.slice(0, this.state.elementsOnPage)
            }
        }
        else if (!this.state.sorted && this.state.activePage > 1 && this.state.activePage <= this.state.totalPages) {
            return {activePageUsers: this.state.users.slice(previosActiveData, indexActiveData)}
        }
        else if (!this.state.sorted && this.state.activePage === 1) {
            return {
                activePageUsers: this.state.users.slice(0, this.state.elementsOnPage)
            }
        }
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
        } else {
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
    updateDB = () => {
        const {userDelName, userDelAge, userDelId} = this.state;
        if (userDelName && userDelAge) {
            axios.put("http://localhost:3001/api/users", {
                id: userDelId,
                name: userDelName,
                age: userDelAge
            })
                .then(res => {
                    return this.getDataFromDb()
                })
        }
    };

    handleClickNextPage = () => {
        if (this.state.activePage < this.state.totalPages) {
            this.setState(PreviosState => {
                return {
                    activePage: PreviosState.activePage + 1
                }
            });
            this.getDataFromDb();
        } else {
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
        this.setState(() => {
            return this.pageUsers()
        });
        this.getDataFromDb();
    };

    sortUser = (event) => {
        const {id} = event.target;

        function compareAge(a, b) {
            if (a.age > b.age) return 1;
            if (a.age < b.age) return -1;
        }

        function compareAgeReverse(a, b) {
            if (a.age > b.age) return -1;
            if (a.age < b.age) return 1;
        }

        function compareName(a, b) {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
        }

        function compareNameReverse(a, b) {
            if (a.name > b.name) return -1;
            if (a.name < b.name) return 1;
        }

        function compareId(a, b) {
            if (a._id > b._id) return 1;
            if (a._id < b._id) return -1;
        }

        function compareIdReverse(a, b) {
            if (a._id > b._id) return -1;
            if (a._id < b._id) return 1;
        }

        if (id === 'name' && !this.state.reverseSort) {
            const sorted = this.state.users.sort(compareName);
            this.setState({sortedUsers: sorted});
            this.setState({sorted: true});
            this.setState({reverseSort: true});
            this.setState(() => {
                return this.pageUsers()
            })
        }
        else if (id === 'name' && this.state.reverseSort) {
            const sorted = this.state.users.sort(compareNameReverse);
            this.setState({reverseSort: false});
            this.setState({sortedUsers: sorted});
            this.setState(() => {
                return this.pageUsers()
            });
        }
        if (id === 'id' && !this.state.reverseSort) {
            const sorted = this.state.users.sort(compareId);
            this.setState({sortedUsers: sorted});
            this.setState({sorted: true});
            this.setState({reverseSort: true});
            this.setState(() => {
                return this.pageUsers()
            })
        }
        else if (id === 'id' && this.state.reverseSort) {
            const sorted = this.state.users.sort(compareIdReverse);
            this.setState({reverseSort: false});
            this.setState({sortedUsers: sorted});
            this.setState(() => {
                return this.pageUsers()
            });
        }


        if (id === 'age' && !this.state.reverseSort) {
            const sorted = this.state.users.sort(compareAge);
            this.setState({sortedUsers: sorted});
            this.setState({sorted: true});
            this.setState({reverseSort: true});
            this.setState(() => {
                return this.pageUsers()
            })
        }
        else if (id === 'age' && this.state.reverseSort) {
            const sorted = this.state.users.sort(compareAgeReverse);
            this.setState({reverseSort: false});
            this.setState({sortedUsers: sorted});
            this.setState(() => {
                return this.pageUsers()
            });
        }


    };

    handleOpenModal = (event) => {
        const {name} = event.target;
        if (name === 'delete' && name !== undefined && name !== null) {
            this.setState({showModalDelete: true});
        } else if (name === 'add' && name !== undefined && name !== null) {
            this.setState({showModalAdd: true});
        }
        else {
            this.setState({showModalUpdate: true});
        }
    };

    handleCloseModal = (event) => {
        const {name} = event.target;
        if (name === 'delete' && name !== undefined && name !== null) {
            this.setState({showModalDelete: false});
        } else if (name === 'add' && name !== undefined && name !== null) {
            this.setState({showModalAdd: false});
        }
        else {
            this.setState({showModalUpdate: false});
        }

    };


    deleteUserAndCloseModal = (event) => {
        this.handleCloseModal(event);
        this.deleteFromDB(this.state.userDelId)
    };

    updateUserAndCloseModal = (event) => {
        this.handleCloseModal(event);
        this.updateDB();
    };
    getTableData = (user) => {
        const {name, age, _id} = user;
        this.setState({
            userDelName: name,
            userDelAge: age,
            userDelId: _id
        });
    };

    handleChange = (event) => {
        const {name, value} = event.target;
        if (name === 'name') {
            this.setState({userDelName: value})
        } else if (name === 'age') {
            this.setState({userDelAge: value})
        } else if (name === 'id') {
            this.setState({userDelId: value})
        } else if (name === 'searchId') {
            this.setState({searchId: value});
            console.log(this.state.searchId)
        }
    };
    handleSearch = () => {
        console.log(typeof(this.state.searchId))
       // {activePageUsers.map((user, key) => {
        //    const {_id, name, age} = user;
    };

    render() {
        const {activePageUsers} = this.state;
        return (
            <div className="App">
                <ReactModal
                    name='delete'
                    className='modal'
                    isOpen={this.state.showModalDelete}
                    contentLabel=" Modal Example"
                >
                    <label>
                        <h2> Вы действительно хотите удалить следующего пользователя? </h2>
                        <h3> id : {this.state.userDelId} </h3>
                        <h3> Имя : {this.state.userDelName} </h3>
                        <h3> Возраст : {this.state.userDelAge} </h3>
                        <div className="onbuton">

                            <button name={'delete'} type="reset" className='button'
                                    onClick={this.deleteUserAndCloseModal}>Удалить
                            </button>
                            <button name={'delete'} type="reset" className="button"
                                    onClick={this.handleCloseModal}
                            >
                                Отмена
                            </button>
                        </div>
                    </label>
                </ReactModal>

                <ReactModal
                    name='update'
                    className='modalUpdate'
                    isOpen={this.state.showModalUpdate}
                    contentLabel=" Modal Example"
                >
                    <label>
                        <table className='update'>
                            <caption>
                                Изменение пользователя
                            </caption>
                            <thead>
                            <tr>
                                <th id='id'>Id</th>
                                <th id='name'>Имя</th>
                                <th id='age'>Возраст</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td><input
                                    type="text"
                                    name='id'
                                    className="input"
                                    onChange={this.handleChange}
                                    value={this.state.userDelId}
                                /></td>
                                <td><input
                                    type="text"
                                    name='name'
                                    onChange={this.handleChange}
                                    className="input"
                                    value={this.state.userDelName}
                                /></td>
                                <td><input
                                    type="number"
                                    name='age'
                                    onChange={this.handleChange}
                                    className="input"
                                    value={this.state.userDelAge}
                                /></td>
                            </tr>
                            </tbody>
                        </table>
                        <div className="onbuton">
                            <button name='update' type="reset" className='button'
                                    onClick={this.updateUserAndCloseModal}>Применить изменения
                            </button>

                            <button name='update' type="reset" className='button'
                                    onClick={this.deleteUserAndCloseModal}>Удалить
                            </button>
                            <button name='update' type="reset" className="button"
                                    onClick={this.handleCloseModal}
                            >
                                Отмена
                            </button>
                        </div>
                    </label>
                </ReactModal>

                <table className="container">
                    <caption>
                        Пользователи

                        <input
                            type="text"
                            name='searchId'
                            className="search"
                            placeholder="Введите текст для поиска"
                            onChange={this.handleChange}
                            value={this.state.searchId || ''}
                        />

                        <button name='add' type="reset" className='button' onClick={this.handleSearch   } >Поиск
                        </button>

                    </caption>
                    <thead>
                    <tr>
                        <th id='id' onClick={this.sortUser}>Id</th>
                        <th id='name' onClick={this.sortUser}>Имя</th>
                        <th id='age' onClick={this.sortUser}>Возраст</th>
                    </tr>
                    </thead>
                    <tbody>
                    {activePageUsers.map((user, key) => {
                        const {_id, name, age} = user;
                        return (
                            <tr onClick={() => this.getTableData(user)} key={key}>
                                <td onClick={(e) => this.handleOpenModal(e)}>{_id} </td>
                                <td onClick={(e) => this.handleOpenModal(e)}>{name}</td>
                                <td onClick={(e) => this.handleOpenModal(e)}>{age}</td>
                                <td>
                                    <div className="onbuton">
                                        <input name='delete' type="button" className='tbutton' value="Удалить"
                                               onClick={(e) => this.handleOpenModal(e)}/>

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
                        <button className='button' name='next' onClick={this.handleClickNextPage}> Следующая
                            страница
                        </button>
                    </div>
                </div>
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
                            <button type="reset" className="button" name='add'
                                    onClick={() => this.putDataToDB(this.state.name, this.state.age)}>
                                Добавить пользователя
                            </button>
                            <button name='add' type="reset" className='button' onClick={this.handleCloseModal}>Выйти
                            </button>
                        </div>
                    </div>
                </ReactModal>
                <div>
                    <div className="onbuton">
                        <button name='add' type="reset" className='button' onClick={this.handleOpenModal}>Добавить
                            пользователя
                        </button>

                    </div>
                </div>
            </div>
        );
    }
}


export default App;
