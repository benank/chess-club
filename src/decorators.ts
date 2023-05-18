
export function performanceCatch(
    originalMethod: any,
    context: ClassMethodDecoratorContext
) {
    const methodName = String(context.name);

    function replacementMethod(this: any, ...args: any[]) {
        let result;
        try {
            result = originalMethod.call(this, ...args);
        } catch (e) {
            console.log(`Error in '${methodName}':`, e);
        }
        return result;
    }

    return replacementMethod;
}
