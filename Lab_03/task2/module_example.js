const basicModule = (function(){
    return {
        greet(){
            console.log('Hello, World!');
        }
    }
})


const privateModule = (function(){
    let counter = 0

    function increment(){
        counter++
    }

    function getCount(){
        return counter
    }

    return{
        increment,
        getCount
    }
})();

export function es6ModuleExample(){
    console.log("Basic Module:");
    const mod = basicModule();
    mod.greet();
}