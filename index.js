// class InMemoryCache {
//     constructor(capacity) {
//         // capacity limit
//         // store key-node map
//         // track head/tail of LRU linked list
//         // maybe a timer or interval for TTL cleanup
//     }

//     get(key) {
//         // check if key exists
//         // check TTL
//         // update LRU order
//         // return value or null
//     }

//     set(key, value, ttl) {
//         // if key exists, update value and TTL
//         // else if at capacity, evict LRU
//         // add new key with TTL
//         // move to head of usage list
//     }

//     delete(key) {
//         // optional: remove a specific key
//     }

//     clear() {
//         // optional: reset the whole cache
//     }

//     // internal: moveToHead(node), removeNode(node), etc.
// }


class Node {
    constructor(value) {
        this.value = value
        this.next = null
    }
}
class LinkedList {
    constructor() {
        this.head = null
    }
    append(value) {
        let newnode = new Node(value)
        console.log("Newnode: ",newnode)
        if (!this.head) {
            this.head = newnode
            console.log("Head: ",this.head)
            return
        }
        let current = this.head
        console.log("Current: ",current)
        while (current.next) {
            current = current.next
            console.log("Inside current: ",current)
        }
        current.next = newnode
        console.log("Current after append: ",current)
        console.log("Head ",this.head)
    }
    printList() {
        let current = this.head
        console.log("Printing List: ", current)
        let result = ""
        console.log("Result: ", result)
        while (current) {
            result += current.value + '->'
            current = current.next
        }
        console.log(result + 'null')
    }
}
let list = new LinkedList()
list.append(10)
list.append(20)
list.append(30)
list.printList()