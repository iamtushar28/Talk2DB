# 🧠 Talk2AI

**Talk2AI** is a smart, AI-powered automation tool built with **Next.js** that lets users interact with databases using **natural language** instead of complex queries.  
Simply type prompts like:

> “Show all users who published blogs”

and Talk2AI will automatically generate the corresponding database query, highlight it for review, and execute it safely — showing the results in a structured table.

---

## 🚀 Features

- 💬 **Natural Language Querying** – Type what you want in plain English.
- 🧠 **AI-Powered Query Generation** – Automatically converts your prompt into a valid database query.
- 🔒 **Safe Execution Layer** – Only allows read-only operations (`find`, `aggregate`, `countDocuments`, etc.).
- 🗄️ **MongoDB Integration** – Connect your MongoDB database easily.
- ⚙️ **Future-Ready** – MySQL and other database support planned.
- 🧾 **Visual Output** – See results in a clean, tabular format.
- 🧍‍♂️ **User-Controlled** – Review and run queries manually before execution.

---

---

## ⚙️ How It Works

1. User enters a **prompt** (e.g., “List top 10 blogs by views”).
2. AI converts the prompt into a valid **MongoDB query**.
3. The generated query is **highlighted** for the user.
4. User confirms and executes the query.
5. Results are fetched through a **secure read-only API** and displayed in a table.

---

## 🔒 Security

Talk2AI ensures all database operations are **read-only**.  
It blocks any write, update, or delete queries (e.g., `insertOne`, `updateMany`, `deleteOne`, etc.) — protecting your data while allowing exploration.

Allowed operations:
- `find()`
- `findOne()`
- `aggregate()`
- `countDocuments()`
- `distinct()`
- `estimatedDocumentCount()`

---

# Working...

Gemini Query Generation Error: Error [ApiError]: {"error":{"code":503,"message":"The model is overloaded. Please try again later.","status":"UNAVAILABLE"}}
    at async POST (app\api\gemini\generate-query\route.js:40:22)
  38 |
  39 |     // 3. Call the Gemini API for Query Generation
> 40 |     const response = await generateContent({
     |                      ^
  41 |       model: GEMINI_MODEL,
  42 |       contents: fullPrompt,
  43 |       config: { {
  status: 503