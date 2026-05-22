
import { useState } from 'react'
import {
    isValidPassword,
    isValidUsername,
    sanitizePassword,
    sanitizeUsername,
} from '../utils/inputValidation'
import { Button } from './ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'

function AuthCard(props){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    async function handleSubmit(e){
    e.preventDefault();

    if (!isValidUsername(username)) {
        setError("Username must be 3-30 characters and use only letters, numbers, or underscores.")
        setMessage("")
        return
    }

    if (!isValidPassword(password)) {
        setError("Password must be 6-72 characters.")
        setMessage("")
        return
    }

    if (props.title === "Sign Up" && password !== confirmPassword) {
        setError("Passwords do not match.")
        setMessage("")
        return
    }
    
    const url = props.title === "Sign Up"
        ? 'http://localhost:5000/auth/signup'
        : 'http://localhost:5000/auth/signin';
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    });    

    const data = await response.json();
    console.log(data);;

    if (data.success) {
        console.log("SUCCESS TRUE")
        setMessage(data.message)
        setError("")

        if (props.title === "Sign In") {
            props.onLoginSuccess(data.user)
        }
    }else {
        setError(data.message)
        setMessage("")
    }
    } 

    return(
        <Card className="mx-auto w-full max-w-sm">
            <CardHeader>
                <CardTitle>{props.title}</CardTitle>
                <CardDescription>{props.description}</CardDescription>
            </CardHeader>

            <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

                <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(sanitizeUsername(e.target.value))}
                        pattern="[A-Za-z0-9_]{3,30}"
                        maxLength={30}
                        autoComplete="username"
                        required
                    /> 
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(sanitizePassword(e.target.value))}
                        minLength={6}
                        maxLength={72}
                        autoComplete={props.title === "Sign Up" ? "new-password" : "current-password"}
                        required
                    />
                </div>

                {props.title === "Sign Up" && (
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(sanitizePassword(e.target.value))}
                            minLength={6}
                            maxLength={72}
                            autoComplete="new-password"
                            required
                        />
                    </div>
                )}

                {message && <p className="text-green-600 text-sm">{message}</p>}
                {error && <p className="text-red-600 text-sm">{error}</p>}

                <Button className="w-full">{props.buttonText}</Button>

                <div>
                    <button
                        type="button"
                        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                        onClick={props.onSwitch}
                    >
                        {props.subDescription}
                    </button>
                </div>
                
                
            </form>
            </CardContent>
        </Card>
    )
}

export default AuthCard
