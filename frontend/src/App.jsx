import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout'
import Public from './components/Public'
import Login from './Features/auth/login'
import DashLayout from './components/Dash/DashLayout'
import Welcome from './Features/auth/Welcome'
import NotesLists from './Features/notes/NotesLists'
import UsersList from './Features/users/UsersList'

function App() {

    return (
        <Routes>
            <Route path='/' element={<Layout />}>
                <Route index element={<Public />} />
                <Route path='login' element={<Login />} />

                <Route path='dash' element={<DashLayout />}>

                    <Route index element={<Welcome />} />

                    <Route path='notes'>
                        <Route index element={<NotesLists />} />
                    </Route>

                    <Route path='users'>
                        <Route index element={<UsersList />} />
                    </Route>

                </Route> {/*end Dash */}

            </Route>
        </Routes>
    )
}

export default App
