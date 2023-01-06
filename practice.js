async function loadJson(url){
    let response = await fetch(url);

    if(response.status === 200){
        let json = await response.json();
        return json;
    }

    throw new Error(response.status);
}

async function wait() {
    await new Promise(resolve => setTimeout(resolve, 5000));
  
    return 10;
  }
  
  function f() {
    // ...what should you write here?
    // we need to call async wait() and wait to get 10
    // remember, we can't use "await"
    wait().then(result => console.log(result));

  }

  f();