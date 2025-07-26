const Search = () => {
    return (
        <header>
            <h2 className="header__title">Search it. Vote it. Eat it.</h2>
            <input
                type="text"
                className="header__search"
                placeholder="Enter a cookie"
            />
        </header>
    );
}

export default Search;