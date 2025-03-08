import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout'
import Public from './components/Public'
import Login from './Features/auth/login'
import DashLayout from './components/Dash/DashLayout'
import Welcome from './Features/auth/Welcome'
import NotesList from './Features/notes/NotesList'
import UsersList from './Features/users/UsersList'
import EditUser from './Features/users/EditUser'
import NewUserForm from './Features/users/NewUserForm'
import EditNote from './Features/notes/EditNote'
import NewNote from './Features/notes/NewNote'
import Prefetch from './Features/auth/Prefetch'

function App() {

    return (
        <Routes>
            <Route path='/' element={<Layout />}>
                <Route index element={<Public />} />
                <Route path='login' element={<Login />} />

                <Route element={<Prefetch />}>
                    <Route path='dash' element={<DashLayout />}>

                        <Route index element={<Welcome />} />

                        <Route path='users'>
                            <Route index element={<UsersList />} />
                            <Route path=':id' element={<EditUser />} />
                            <Route path='new' element={<NewUserForm />} />
                        </Route>

                        <Route path='notes'>
                            <Route index element={<NotesList />} />
                            <Route path=':id' element={<EditNote />} />
                            <Route path='new' element={<NewNote />} />
                        </Route>

                    </Route> {/*end Dash */}
                </Route>

            </Route>
        </Routes>
    )
}

export default App
