class httpLibrary{
    sendHttpRequest(url, method, data){
        return fetch(url, {
            method: method,
            body: JSON.stringify(data),
            headers: data ? {"Content-type" : "application/json"} : {}
        }).then(response => {
            if(!response.ok){
                return response.json().then(errorData => {
                    const error = new Error("Something went wrong!")
                    error.data = errorData
                    throw error
                })
            }
            return response.json()
        })
    }
}