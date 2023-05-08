import { useRouteError } from "react-router-dom";

export function ErrorPage() {
    const error: any = useRouteError();
    return (
        <div className="error-page">
            <h2 className="">Shit happens!</h2>
            <p className="">Sorry, an error has occurred. Right now I don't have the resources to solved but I will, chill out.</p>
            <h4>The error is: </h4>
            <i>{error.statusText || error.message}</i>
        </div>
    );
    
}