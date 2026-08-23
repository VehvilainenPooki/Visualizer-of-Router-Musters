import { Paper } from "@mantine/core";
import Graph from "../Primitives/Graph";
import { ViewNavbar } from "./ViewNavbar";
import { TitleNavbar } from "../Primitives/Navbar/TitleNavbar";
import { Illustration } from "../../../common/types/illustration";


export function InspectView( {illustration}: {illustration?: Illustration} ) {
  if (!illustration) {
    return (
      <TitleNavbar title="Illustration not found" />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <ViewNavbar illustration={illustration} />
      <div style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
        <Paper style={{
          height: '100%', minWidth: 0,
          minHeight: 0,
          overflow: 'hidden',
          position: 'relative'

        }}>
          <Graph data={illustration.graphcode} />
        </Paper>
      </div>
    </div>
  )
}