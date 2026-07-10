package com.luxrental.common.utils;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

/**
 * A custom generic wrapper for a Map collection.
 *
 * @param <K> The type of keys maintained by this map
 * @param <V> The type of mapped values
 */
public class CustomDataHolder<K, V> {

    // The internal map is strongly typed using the class generics
    private final Map<K, V> internalMap;

    // Default constructor uses HashMap
    public CustomDataHolder() {
        this.internalMap = new HashMap<>();
    }

    // Add or update an element
    public void put(K key, V value) {
        internalMap.put(key, value);
    }

    // Retrieve an element safely using Optional to prevent NullPointerExceptions
    public Optional<V> get(K key) {
        return Optional.ofNullable(internalMap.get(key));
    }

    // Remove an element
    public boolean remove(K key) {
        return internalMap.remove(key) != null;
    }

    // Check if a key exists
    public boolean containsKey(K key) {
        return internalMap.containsKey(key);
    }

    // Get all keys
    public Set<K> getAllKeys() {
        return internalMap.keySet();
    }

    // Clear all data
    public void clear() {
        internalMap.clear();
    }

    // Get the current size
    public int size() {
        return internalMap.size();
    }
}
