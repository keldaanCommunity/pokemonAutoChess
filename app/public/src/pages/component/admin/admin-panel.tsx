import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import Maintenance from "./maintenance"
import { TournamentsAdmin } from "./tournaments-admin"
import "./admin-panel.css"

export default function AdminPanel() {
  return (
    <div className="admin-panel">
      <Tabs>
        <TabList>
          <Tab>Tournaments</Tab>
          <Tab>Maintenance</Tab>
        </TabList>

        <TabPanel>
          <TournamentsAdmin />
        </TabPanel>
        <TabPanel>
          <Maintenance />
        </TabPanel>
      </Tabs>
    </div>
  )
}
