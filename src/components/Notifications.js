import { Link } from "react-router-dom";

const Notifications = ({ notifs }) => {

    const renderSwitch = (notif) => {
        switch(notif.type) {
            case "liked post":
                return (
                <div>
                    <Link to={notif.user.url}>{notif.user.name.full}</Link>
                    has liked your <Link to={notif.postID.url}>post</Link>.
                </div>
                )
            case "post comment":
                return(
                    <div>
                        <Link to={notif.user.url}>{notif.user.name.full}</Link>
                        has <Link to={notif.newCommentID.url}>commented</Link> 
                        on your <Link to={notif.postID.url}>post</Link>.
                    </div>
                )
            
            case "comment comment":
                return(
                    <div>
                        <Link to={notif.user.url}>{notif.user.name.full}</Link>
                        has <Link to={notif.newCommentID.url}>replied</Link>
                        to your <Link to={notif.parentCommentID.url}>comment</Link>.
                    </div>
                )
            case "liked comment":
                return (
                    <div>
                        <Link to={notif.user.url}>{notif.user.name.full}</Link>
                        has liked your <Link to={notif.commentID.url}>comment</Link>.
                    </div>
                )

            case "friend request accepted":
                return (
                    <div>
                        <Link to={notif.profileID.url}>{notif.profileID.name.full}</Link>
                         has accepted your friend request.
                    </div>
                )
            
            default:
                return;
        }
    }

    return (
        <div>
            {notifs.map(notif => renderSwitch(notif))}
        </div>
    )
};

export { Notifications };