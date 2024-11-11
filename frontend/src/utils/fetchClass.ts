type obj = {
  [key: string ]: string | number;
}

type Body = {
  [key: string] : string | number | obj;
}

export class FetchWithAuth{
  private uri: string;
  private accessToken: string;
  private body?: string;
  private cacheTag?: string[];

  constructor({ 
    uri, 
    accessToken, 
    body, 
    cacheTag
  }: {
    uri: string, 
    accessToken: string, 
    body?: Body, 
    cacheTag?: string[]
  }){
    this.uri = process.env.SERVER_URI + uri;
    this.accessToken = accessToken;
    this.body = body ? JSON.stringify({ ...body }) : undefined ;
    this.cacheTag = cacheTag;
  }

  private BaseMethod(){
    const baseInit = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.accessToken}`
      },
      body: this.body,
      next: {
        tags: this.cacheTag
      }
    } satisfies RequestInit;
    return baseInit;
  }

  async getMethod(){
    try{
      const res = await fetch(this.uri, {
      method: "GET",
      ...this.BaseMethod(),
      });
      if(res.status !== 200) throw new Error("Fetch Error");
      const data = await res.json();
      return data;

    }catch(error){
      throw error;
    }
  }

  async postMethod(){
    try{
      const res = await fetch(this.uri, {
        method: "POST",
        ...this.BaseMethod(),
      });
      if(res.status !== 201) throw new Error("Fetch Error");
      const data = await res.json();
      return data;

    }catch(error){
      throw error;

    }
  }

  async updateMethod(){
    try{
      const res = await fetch(this.uri, {
      method: "UPDATE",
      ...this.BaseMethod(),
      });
      if(res.status !== 200) throw new Error("Fetch Error");
      const data = await res.json();
      return data;

    }catch(error){
      throw error;
    }
  }

  async deleteMethod(){
    try{
      const res = await fetch(this.uri, {
        method: "DELETE",
        ...this.BaseMethod(),
      });
      if(res.status !== 204) throw new Error("Fetch Error");
      const data = await res.json();
      return data;

    }catch(error){
      throw error;

    }
  }

}