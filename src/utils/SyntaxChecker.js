class SyntaxChecker{
    constructor(){
        console.info("SyntaxChecker");
    }
    checkSyntax(text_net){
        let json = JSON.parse(text_net);
        return json !== null;
    }
}

module.exports = new SyntaxChecker();