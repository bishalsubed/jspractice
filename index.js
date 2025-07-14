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
        this.map = new Map();

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
        if (!this.head) {
            let newValue = new Node(key, value, ttl)
            this.map.set(key, newValue)
            this.head = newValue;
            this.tail = newValue;
            return
        }
        let tillNow = this.head
        if (tillNow.key === key) {
            tillNow.value = value;
            tillNow.ttl = ttl;
            let key = this.map.get(key)
            key.value = value;
            key.ttl = ttl;
            key.prev = null;
            key.next = null
            return
        }
        while (tillNow.next) {
            tillNow = tillNow.next;
            if (tillNow.key === key) {
                tillNow.value = value;
                tillNow.ttl = ttl;
                this.moveToHead(tillNow);
                return
            }
        }
        if (this.map.size >= this.capacity) {
            this.removeLastNode()
        }
        let newValue = new Node(key, value, ttl)
        this.map.set(key, newValue);
        newValue.next = this.head;
        this.head.prev = newValue
        this.head = newValue;


        // if key exists, update value and TTL
        // else if at capacity, evict LRU
        // add new key with TTL
        // move to head of usage list
    }

    delete(key) {
        if (!this.map.has(key)) return;
        let current = this.head
        if (current.key === key) {
            if (!current.next) {
                current.key = null;
                current.value = null;
                current.ttl = null;
                this.map.delete(key);
                return
            }
            current.next.prev = null;
            this.head = current.next
            this.map.delete(key);
            return;
        }
        while (current.next) {
            current = current.next
            if (current.key === key) {
                current.prev.next = null
                current = current.prev
                return
            }
        }
        this.map.delete(key);
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
            this.map.delete(this.tail.key)
            this.tail = this.tail.prev
        }
    }

    moveToHead(node) {
        if (!this.head) {
            this.head = node
            this.tail = node;
        }
        if (this.head === node) return;
        if (node.next) {
            node.prev.next = node.next;
            node.next.prev = node.prev;
        } else {
            this.tail = node.prev
        }
        this.head.prev = node;
        node.next = this.head;
        node.prev = null;
        this.head = node;
    }

    // internal: moveToHead(node), removeNode(node), etc.
}

const cache = new InMemoryCache(3);
cache.set('a', 1, 1000);
cache.set('b', 2, 1000);
cache.set('c', 3, 1000);
cache.delete('c')
cache.printList();
