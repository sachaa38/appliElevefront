/* eslint-disable react/react-in-jsx-scope */
import TableauDeBord from '../../components/tableau_de_bord'
import './style.scss'
import Planning from '../../components/planning'
import Navig from '../../components/navig'

function Home() {
  return (
    <div>
      <Navig />
      <div className="home">
        <div className="pageFormat">
          <TableauDeBord />
          <Planning />
        </div>
      </div>
    </div>
  )
}
export default Home
