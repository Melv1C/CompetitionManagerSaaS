import { Avatar, Badge } from "@mui/material"
import { Users } from "./Icons"

type ShowUsersNumberParams = {
    value: number
}

export const ShowUsersNumber: React.FC<ShowUsersNumberParams> = ({value}) => {
    return (
        <Badge badgeContent={value} color="info" showZero max={999} overlap="circular">
            <Avatar sx={{ width: '2rem', height: '2rem', color: 'black', backgroundColor: "divider", margin:'0.2rem'}}>
                <Users size="sm" color="inherit" />
            </Avatar>
        </Badge>
    )
}
