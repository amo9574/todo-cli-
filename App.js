import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const DB = 'todos.json';

// Eğer dosya yoksa oluştur
if (!fs.existsSync(DB)) {
    fs.writeFileSync(DB, JSON.stringify([]));
}

const loadTodos = () => JSON.parse(fs.readFileSync(DB));
const saveTodos = (todos) => fs.writeFileSync(DB, JSON.stringify(todos, null, 2));

yargs(hideBin(process.argv))
    .command('add <text>', 'Add new todo', (yargs) => {
        yargs.positional('text', { describe: 'Todo text' });
    }, (argv) => {
        const todos = loadTodos();
        todos.push({ id: Date.now(), text: argv.text });
        saveTodos(todos);
        console.log('Todo added:', argv.text);
    })
    .command('list', 'List todos', () => { }, () => {
        const todos = loadTodos();
        console.log("\nYour Todos:");
        todos.forEach((t) => console.log(`- ${t.text} (${t.id})`));
    })
    .command('remove <id>', 'Remove todo by id', (yargs) => {
        yargs.positional('id', { describe: 'Todo ID', type: 'number' });
    }, (argv) => {
        let todos = loadTodos();
        todos = todos.filter((t) => t.id !== argv.id);
        saveTodos(todos);
        console.log('Todo removed:', argv.id);
    })
    .parse();
