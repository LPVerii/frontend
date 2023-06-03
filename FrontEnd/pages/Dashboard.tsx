import DefaultLayout from "../components/defaultLayout/DefaultLayout";

export default function Dashboard({user}: {user:any}) {
 
        return (

            <DefaultLayout title="Dashboard" user={user}></DefaultLayout>
        )
}