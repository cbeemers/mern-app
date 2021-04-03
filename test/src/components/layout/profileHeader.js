import React, {Component} from 'react'

export default class ProfileHeader extends Component {
    constructor(props) {
        super(props)
        // console.log(props.profilePicture)
        let joined = new Date(props.joinedDate)

        let joinStr = (joined.getMonth()+1) + "/" + joined.getDate() + '/' + joined.getFullYear()

        this.state = {
            profilePicture: props.profilePicture,
            firstName: props.firstName,
            lastName: props.lastName,
            bio: props.bio,
            joinedDate: props.joinedDate,
            joinStr,
        }
    }

    render() {
        let {profilePicture, firstName, lastName, joinStr} = this.state
        return (
            <header style={head}>
                <div style={{display:"flex"}}>
                    <img style={{boxShadow: ".5em 1em 1em black", width: "20em", height: "20em"}} className="profile-picture-else" src={profilePicture} />
                        <div style={{textAlign: "center", padding: "2em", flex: "1", flexDirection: "column"}}>
                            <h1 style={{padding: "1em 0"}}>{firstName} {lastName}</h1>
                            <div>
                                <h4>Joined: {joinStr}</h4>
                                <p>some stuff to simulate bio</p>
                            </div>

                        </div>
                </div>
            </header>
        )
    }
}

let head = {
    backgroundColor: "#192635",
    padding: "2em",
    color: "white",
}