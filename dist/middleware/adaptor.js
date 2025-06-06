export function adaptor(recipe) {
    return function produceState(baseState) {
        if (typeof baseState !== 'object' || baseState === null) {
            const result = recipe(baseState);
            return result === undefined ? baseState : result;
        }
        const drafts = new WeakMap();
        const parents = new WeakMap();
        const copies = new WeakMap();
        const modified = new WeakSet();
        let isModified = false;
        function createDraft(base, parent = null, key = null) {
            if (typeof base !== 'object' || base === null) {
                return base;
            }
            if (drafts.has(base)) {
                return drafts.get(base);
            }
            const handler = {
                get(target, prop) {
                    if (prop === '__isDraft')
                        return true;
                    if (typeof prop === 'symbol' ||
                        ['constructor', 'prototype', '__proto__'].includes(prop)) {
                        return target[prop];
                    }
                    const value = target[prop];
                    if (typeof value !== 'object' || value === null) {
                        return value;
                    }
                    return createDraft(value, target, prop);
                },
                set(target, prop, value) {
                    if (Object.is(target[prop], value)) {
                        return true;
                    }
                    const copy = getOrCreateCopy(target);
                    copy[prop] = value;
                    markChanged(target);
                    return true;
                },
                deleteProperty(target, prop) {
                    if (!(prop in target))
                        return true;
                    const copy = getOrCreateCopy(target);
                    delete copy[prop];
                    markChanged(target);
                    return true;
                }
            };
            const draft = new Proxy(base, handler);
            drafts.set(base, draft);
            if (parent && key !== null) {
                parents.set(draft, { parent, key });
            }
            return draft;
        }
        function markChanged(target) {
            if (modified.has(target))
                return;
            modified.add(target);
            isModified = true;
            const draft = drafts.get(target);
            if (draft && parents.has(draft)) {
                const { parent } = parents.get(draft);
                markChanged(parent);
            }
        }
        function getOrCreateCopy(target) {
            if (!copies.has(target)) {
                copies.set(target, Array.isArray(target) ? target.slice() : { ...target });
            }
            return copies.get(target);
        }
        function finalize(base) {
            if (typeof base !== 'object' || base === null) {
                return base;
            }
            if (!modified.has(base)) {
                return base;
            }
            const copy = copies.get(base);
            for (const key of Object.keys(copy)) {
                const value = base[key];
                if (typeof value === 'object' && value !== null) {
                    copy[key] = finalize(value);
                }
            }
            return Object.freeze(copy);
        }
        const draft = createDraft(baseState);
        const result = recipe(draft);
        if (result !== undefined && result !== draft) {
            return result;
        }
        if (!isModified) {
            return baseState;
        }
        return finalize(baseState);
    };
}
