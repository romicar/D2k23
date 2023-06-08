import { Link } from "react-router-dom";
import CreatePage from "./Create";
import ModifyTemplate from "./Create/ModifyTemplate";

import CreateTemplate from "./Create/CreateTemplate";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type ItemProps = {
    page: string
}

export const Item = ({ page }: ItemProps) => {
    // window.alert(page);
    if (page === "homepage") {
        return <div id="page">
            <CreatePage />
        </div>;
    }
    else if (page === "Templates") {
        return (<div>
            <ModifyTemplate />
        </div>);
    }
    else if (page === "createTemplate") {
        return (<div>
            <CreateTemplate />
        </div>);
    }
    else {
        return (
            <div id="page">
                <Link to="/">
                    <button className="btn">
                        <ArrowBackIcon /> Back to Home
                    </button>
                </Link>
                {page}
            </div>
        );
    }
};