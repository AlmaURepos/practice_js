### SNIPPET_01
- Pattern Family: Creational

- Specific Pattern Singleton

- Evidence: 

```js
if(DatabaseConnection._instance){
    return DatabaseConnection._instance
}
static getInstance(){
    if(!DatabaseConnection._instance){
        new DatabaseConnection('localhost',5432)
    }
    return DatabaseConnection._instance
}
```

- Reasoning: Обеспечивает единственный экземпляр класса с глобальной точкой доступа через статический метод getInstance() и приватное поле _instance.

### SNIPPET_02
- Pattern Family: Behavioral

- Specific Pattern Observer

- Evidence: 

```js
subscribe(event, callback){ ... }
publish(event, data){
    handlers.forEach(handler=>handler(data))
}
```

- Reasoning: Реализует паттерн подписки на события через методы subscribe() и publish() с уведомлением всех подписчиков через callbacks.

### SNIPPET_03
- Pattern Family: Structural 

- Specific Pattern Facade

- Evidence: 

```js
login(token){
    if(!this._auth.validateToken(token)) ...
    const user = this._repo.findByToken(token)
    this._logger.log('login', user)
}
```

- Reasoning: Предоставляет простой унифицированный интерфейс login() для доступа к сложной системе аутентификации, репозитория и логирования.

### SNIPPET_04
- Pattern Family: Creational 

- Evidence: 

```js
function createNotifier(type){
    switch(type){
        case 'sms': return new SMSNotifier()
        case 'telegram': return new TelegramNotifier()
    }
}
```

- Reasoning: Фабрика createNotifier() инкапсулирует логику создания различных типов уведомителей в зависимости от параметра type.

### SNIPPET_05
- Pattern Family: Structural 

- Evidence: 

```js
class SeverityLogger{
    constructor(logger, level){
        this._logger = logger
    }
    log(message){
        this._logger.log(`[${this._level}] ${message}`)
    }
}
```

- Reasoning: Оборачивает объект логгера добавляя функцию форматирования с уровнем серьезности к сообщениям без изменения его интерфейса.

### SNIPPET_06
- Pattern Family: Creational 

- Evidence: 

```js
const car = vehiclePrototype.clone()
Object.getPrototypeOf(car) === vehiclePrototype
```

- Reasoning: Клонирует объект vehiclePrototype создавая новый экземпляр через прототип без необходимости создания подклассов.

### SNIPPET_07
- Pattern Family: Behavioral

- Evidence: 

```js
if(this.next){
    this.next.handle(ticket)
}
```

- Reasoning: Передает обработку запроса (ticket) по цепи обработчиков через this.next, позволяя каждому обработчику решить может ли он это обработать.

### SNIPPET_08
- Pattern Family: Behavioral

- Evidence: 

```js
execute() {this.editor.write(this.chars)}
undo(){this.editor.delete(this.chars.length)}
```

- Reasoning: Инкапсулирует действия (execute/undo) в объект команды с возможностью выполнения и отката операции редактирования.

### SNIPPET_09
- Pattern Family: Structural 

- Evidence: 

```js
if(!this._types[key]){
    this._types[key] = new TreeType(name, color, texture)
}
```

- Reasoning: Переиспользует существующие объекты TreeType вместо создания дубликатов, экономя память через кэширование по ключу.

### SNIPPET_10
- Pattern Family: Behavioral
- Evidence:

```js
class ChatRoom{
    send(from, message, toName = null){ ... }
}
```

- Reasoning: Центральный объект ChatRoom управляет всей коммуникацией между участниками через метод send() вместо прямой коммуникации между ними.