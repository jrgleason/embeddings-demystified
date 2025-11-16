function MainNavbar({title}) {
    return (
        <nav>
            <div className={"max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4"}>
                <h1 className={"text-xl font-semibold"}>{title}</h1>
            </div>
        </nav>
    )
}
export default MainNavbar