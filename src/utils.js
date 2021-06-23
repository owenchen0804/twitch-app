const SERVER_ORIGIN = '';
// const SERVER_ORIGIN = '/jupiter'; 本地交流的时候

const loginUrl = `${SERVER_ORIGIN}/login`;

export const login = (credential) => {
    return fetch(loginUrl, {  // fetch 返回promise
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // 允许 cookie/ session ID 的传递
        body: JSON.stringify(credential)  // 把前端要发出去的东西压成 string 放在body里
    }).then((response) => {
        if (response.status !== 200) {
            throw Error('Fail to log in');
        }
        return response.json();
    })
    // .then 这种用法不会阻塞(block)后面的代码 前面的代码开始执行后 就放进queue里
    // .then的代码会被 delay到fetch返回后执行
    // fetch需要一段时间 不需要等它完成 才能执行后面的代码
    // ... 如果这里有其它代码
}

const registerUrl = `${SERVER_ORIGIN}/register`;

export const register = (data) => {
    return fetch(registerUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then((response) => {
        if (response.status !== 200) {
            throw Error('Fail to register');
        }
    })
}

const logoutUrl = `${SERVER_ORIGIN}/logout`;

export const logout = () => {
    return fetch(logoutUrl, {
        method: 'POST',
        credentials: 'include',
    }).then((response) => {
        if (response.status !== 200) {
            throw Error('Fail to log out');
        }
    })
}

const topGamesUrl = `${SERVER_ORIGIN}/game`;

export const getTopGames = () => {
    return fetch(topGamesUrl).then((response) => {
        if (response.status !== 200) {
            throw Error('Fail to get top games');
        }

        return response.json();
    })
}

const getGameDetailsUrl = `${SERVER_ORIGIN}/game?game_name=`;

const getGameDetails = (gameName) => {
    return fetch(`${getGameDetailsUrl}${gameName}`).then((response) => {
        if (response.status !== 200) {
            throw Error('Fail to find the game');
        }

        return response.json();
    });
}

const searchGameByIdUrl = `${SERVER_ORIGIN}/search?game_id=`;

export const searchGameById = (gameId) => {
    return fetch(`${searchGameByIdUrl}${gameId}`).then((response) => {
        if (response.status !== 200) {
            throw Error('Fail to find the game');
        }
        return response.json();
    })
}

export const searchGameByName = (gameName) => {
    return getGameDetails(gameName).then((data) => {
        if (data && data.id) {
            return searchGameById(data.id);
        }

        throw Error('Fail to find the game')
    })
}

const favoriteItemUrl = `${SERVER_ORIGIN}/favorite`;

export const addFavoriteItem = (favItem) => {
    return fetch(favoriteItemUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ favorite: favItem })
    }).then((response) => {
        if (response.status !== 200) {
            throw Error('Fail to add favorite item');
        }
    })
}

export const deleteFavoriteItem = (favItem) => {
    return fetch(favoriteItemUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ favorite: favItem })
    }).then((response) => {
        if (response.status !== 200) {
            throw Error('Fail to delete favorite item');
        }
    })
}

export const getFavoriteItem = () => {
    return fetch(favoriteItemUrl, {
        credentials: 'include',
    }).then((response) => {
        if (response.status !== 200) {
            throw Error('Fail to get favorite item');
        }

        return response.json();
    })
}

const getRecommendedItemsUrl = `${SERVER_ORIGIN}/recommendation`;

export const getRecommendations = () => {
    return fetch(getRecommendedItemsUrl, {
        credentials: 'include',
    }).then((response) => {
        if (response.status !== 200) {
            throw Error('Fail to get recommended item');
        }

        return response.json();
    })
}