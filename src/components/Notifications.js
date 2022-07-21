import { Link } from "react-router-dom";
import { useEffect } from "react";

const Notifications = ({ notifs, setNotifsActive }) => {

    useEffect(() => {
        setNotifsActive(true);

        return () => {
            setNotifsActive(false)
        }
    }, [setNotifsActive])

    const renderSwitch = (notif, index) => {
        switch(notif.type) {
            case "liked post":
                return (
                <div key={index}>
                    <Link to={"../" + notif.profileID.url}>{notif.profileID.name.full} </Link>
                    has liked your <Link to={"../" + notif.postID.url}>post</Link>.
                </div>
                )
            case "post comment":
                return(
                    <div key={index}>
                        <Link to={"../" + notif.profileID.url}>{notif.profileID.name.full} </Link>
                        has <Link to={"../" + notif.newCommentID.url}>commented</Link> 
                        on your <Link to={"../" + notif.postID.url}>post</Link>.
                    </div>
                )
            
            case "comment comment":
                return(
                    <div key={index}>
                        <Link to={"../" + notif.profileID.url}>{notif.profileID.name.full} </Link>
                        has <Link to={"../" + notif.newCommentID.url}>replied</Link>
                        to your <Link to={"../" + notif.parentCommentID.url}>comment</Link>.
                    </div>
                )
            case "liked comment":
                return (
                    <div key={index}>
                        <Link to={"../" + notif.profileID.url}>{notif.profileID.name.full} </Link>
                        has liked your <Link to={"../" + notif.commentID.url}>comment</Link>.
                    </div>
                )

            case "friend request accepted":
                return (
                    <div key={index}>
                        <Link to={"../" + notif.profileID.url}>{notif.profileID.name.full}</Link>
                         has accepted your friend request.
                    </div>
                )
            
            default:
                return;
        }
    }

    return (
        <div>
            {notifs.length ? notifs.map((notif, index) => renderSwitch(notif, index)) : null}
        </div>
    )
};

export { Notifications };