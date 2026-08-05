import { DraftBoardProvider } from "./DraftBoardProvider"; // Assuming you have a DraftBoard
import ScouterContext from "./ScouterContext";

const Scouter = ({ token }) => {


    return (
        <DraftBoardProvider>
            <ScouterContext token={token}/>
        </DraftBoardProvider>
    );
};

export default Scouter;