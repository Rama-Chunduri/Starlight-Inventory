import Dashboard from './Dashboard'
import FlowRestrictorBOM from './FlowRestrictorBOM'
import ImplantInventory from './ImplantInventory'
import ImplantInventoryView from './ImplantInventoryView'
import ImplantInventoryInsert from './ImplantInventoryInsert'
import ImplantInventoryDelete from './ImplantInventoryDelete'
import StentBOM from './StentBOM'
import Login from './Login'
import SignUp from './SignUp'
import Dashboard2 from './Dashboard2'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import EditPermissions from './EditPermissions'
import AddUser from './AddUser'
import UpdatePermissions from './UpdatePermissions'
import StentBOMGView from './StentBOMGView'
import StentBOMTView from './StentBOMTView'
import StentBOMBuild from './StentBOMBuild'
import KitDetailPage from './KitDetailPage'
import KitBuild from './KitBuild'
import FRView from './FRView'
import FRGView from './FRGView'
import FRBuild from './FRBuild'
import StentInvTable from './StentInvTable'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />}/>
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path='/implant-inventory' element={<ImplantInventory />}/>
        <Route path='/stent-bom' element={<StentBOM />}/>
        <Route path='/flow-restrictor-bom' element={<FlowRestrictorBOM />}/>
        <Route path='/implant-inventory-view' element={<ImplantInventoryView/>}/>
        <Route path='/implant-inventory-insert' element={<ImplantInventoryInsert/>}/>
        <Route path='/implant-inventory-delete' element={<ImplantInventoryDelete/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/dashboard2' element={<Dashboard2/>}/>
        <Route path='/edit-permissions' element={<EditPermissions/>}/>
        <Route path='/add-user' element={<AddUser/>}/>
        <Route path='/update-permissions' element={<UpdatePermissions/>}/>
        <Route path='/stent-bom-graph-view' element={<StentBOMGView/>}/>
        <Route path='/stent-bom-table-view' element={<StentBOMTView/>}/>
        <Route path='/stent-bom-build' element={<StentBOMBuild/>}/>
        <Route path="/kits" element={<KitDetailPage />} />
        <Route path='/kit-build' element={<KitBuild/>}/>
        <Route path='/fr-bom-table-view' element={<FRView/>}/>
        <Route path='/fr-bom-graph-view' element={<FRGView/>}/>
        <Route path='/fr-bom-build' element={<FRBuild/>}/>
        <Route path='/stent-inventory-table-view' element={<StentInvTable/>}/>
      </Routes>
    </Router>
  )
}

export default App
