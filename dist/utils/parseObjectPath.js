export const parseObjectPath = (input) => {
    if (!/=>/.test(input))
        throw new Error('Invalid caro-kann selector format: missing " => "');
    if (/{|}/.test(input))
        throw new Error('Invalid caro-kann selector format: contains curly braces({ })');
    if (/&|:|\?/.test(input))
        throw new Error('Invalid caro-kann selector format: contains disallowed special characters(? : &)');
    const path = input.split('=>')[1].trim();
    const invalidMatch = path.match(/\[(?!["'])([^\]]+)(?!["'])\]/);
    if (invalidMatch)
        throw new Error(`Invalid path detected: ${invalidMatch[0]}`);
    const keys = Array.from(path.matchAll(/(?:\.|^)(\w+)|\["(.+?)"\]/g))
        .map(match => match[1] || match[2]).slice(1);
    return keys;
};
