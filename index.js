class Node {
    constructor(key, value, ttl) {
        this.key = key;
        this.value = value;
        this.ttl = ttl
        this.next = null;
        this.prev = null;
    }
}
class InMemoryCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.head = null;
        this.tail = null;

        // capacity limit
        // store key-node map
        // track head/tail of LRU linked list
        // maybe a timer or interval for TTL cleanup
    }

    get(key) {
        // check if key exists
        // check TTL
        // update LRU order
        // return value or null
    }

    set(key, value, ttl) {
        const map = new Map();
        if (!this.head) {
            let newValue = new Node(key, value, ttl)
            map.set(key, value)
            this.head = newValue;
            this.tail = newValue;
            return
        }
        let tillNow = this.head
        if (tillNow.key === key) {
            tillNow.value = value;
            tillNow.ttl = ttl;
        }
        while (tillNow.next) {
            if (tillNow.key === key) {
                tillNow.value = value;
                tillNow.ttl = ttl;
            }
            tillNow = tillNow.next;
        }
        if(map.size >= this.capacity){
            this.removeLastNode()
        }
        let newValue = new Node(key, value, ttl)
        map.set(key, value)
        newValue.next = this.head;
        this.head.prev = newValue
        this.head = newValue;

        // if key exists, update value and TTL
        // else if at capacity, evict LRU
        // add new key with TTL
        // move to head of usage list
    }

    delete(key) {
        // optional: remove a specific key
    }

    clear() {
        // optional: reset the whole cache
    }

    printList() {
        let current = this.head
        let result = ""
        while (current) {
            result += current.value + '->'
            current = current.next
        }
        console.log(result + 'null')
    }

    removeLastNode() {
        if (!this.tail) return;
        if (this.tail.prev) {
            this.tail.prev.next = null;
            this.tail = this.tail.rev
        }
    }

    // internal: moveToHead(node), removeNode(node), etc.
}